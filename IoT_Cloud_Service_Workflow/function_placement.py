from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from airflow.contrib.operators.SSHExecuteOperator import SSHExecuteOperator

sshThing = SSHHook(conn_id='thing-ssh')
sshConcentrator = SSHHook(conn_id='concentrator-ssh')
sshHub = SSHHook(conn_id='hub-ssh')
sshCloud = SSHHook(conn_id='cloud-ssh')

dag = DAG('function-stitching',description='Function Stitching',
          schedule_interval = '0 0 * * *',
          start_date=datetime(2017,07,01),catchup=False)

t1 = BashOperator(
        task_id='load configuration',
        bash_command='./opt/airflow/load-config.sh',
        dag=dag)

t2_1 = SSHExecuteOperator(
        task_id='runl_functions_things',
        bash_command='docker run -it --net=host --name flume --env-file=/opt/airflow/flume.config registry/smartxenergy-flume',
        ssh_hook=sshThing,
        dag=dag)

t2_2 = SSHExecuteOperator(
        task_id='pull_functions_concentrator',
        bash_command='docker run -it --net=host --name controller --env-file=/opt/airflow/controller.config registry/smartxenergy-controller',
        ssh_hook=sshConcentrator,
        dag=dag)

t2_3 = SSHExecuteOperator(
        task_id='pull_functions_hub',
        bash_command='docker run -it --net=host --name broker --env-file=/opt/airflow/kafka.config registry/smartxenergy-kafka',
        ssh_hook=sshHub,
        dag=dag)

t2_4 = SSHExecuteOperator(
        task_id='pull_functions_cloud',
        bash_command='docker run -it --net=host --name flume --env-file=/opt/airflow/flume.config registry/smartxenergy-influxdb',
        ssh_hook=sshCloud,
        dag=dag)

t3 = BashOperator(
        task_id='finish',
        bash_command='. /opt/airflow/dags/finish.sh',
        dag=dag)

t1.set_downstream(t2_1)
t1.set_downstream(t2_2)
t1.set_downstream(t2_3)
t1.set_downstream(t2_4)

t3.set_upstream(t2_1)
t3.set_upstream(t2_2)
t3.set_upstream(t2_3)
t3.set_upstream(t2_4)

